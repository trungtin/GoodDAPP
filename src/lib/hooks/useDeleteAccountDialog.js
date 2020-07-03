import React, { useCallback } from 'react'
import { AsyncStorage } from 'react-native'

import logger from '../logger/pino-logger'
import IconWrapper from '../../components/common/modal/IconWrapper'
import LoadingIcon from '../../components/common/modal/LoadingIcon'

import retryImport from '../utils/retryImport'

const log = logger.child({ from: 'useDeleteAccountDialog' })

export const deleteGunDB = () => {
  return new Promise((res, rej) => {
    const openreq = indexedDB.open('radata')
    openreq.onerror = e => res()
    openreq.onsuccess = e => {
      const db = openreq.result
      var transaction = db.transaction(['radata'], 'readwrite')
      transaction.onerror = e => res()

      // create an object store on the transaction
      const objectStore = transaction.objectStore('radata')

      // Make a request to clear all the data out of the object store
      const objectStoreRequest = objectStore.clear()

      objectStoreRequest.onsuccess = res
      objectStoreRequest.onerror = rej
    }
  })
}

export default ({ API, showDialog, store, theme }) =>
  useCallback(
    () =>
      showDialog('', '', {
        title: 'ARE YOU SURE?',
        message: 'If you delete your account',
        boldMessage: 'you might lose access to your G$!',
        image: <IconWrapper iconName="trash" color={theme.colors.error} size={50} />,
        buttons: [
          { text: 'Cancel', onPress: dismiss => dismiss(), mode: 'text', color: theme.colors.lighterGray },
          {
            text: 'Delete',
            color: theme.colors.red,
            onPress: async () => {
              showDialog('', '', {
                title: 'ARE YOU SURE?',
                message: 'If you delete your account',
                boldMessage: 'you might lose access to your G$!',
                image: <LoadingIcon />,
                showButtons: false,
              })
              try {
                const userStorage = await retryImport(() => import('../gundb/UserStorage')).then(_ => _.default)

                let token = await userStorage.getProfileFieldValue('w3Token')

                if (!token) {
                  token = await userStorage.getProfileFieldValue('loginToken')
                }

                const isDeleted = await userStorage.deleteAccount()
                log.debug('deleted account', isDeleted)

                if (isDeleted) {
                  token && API.deleteWalletFromW3Site(token).catch(e => log.warn(e.message, e))
                  const req = deleteGunDB()

                  //remove all local data so its not cached and user will re-login
                  await Promise.all([AsyncStorage.clear(), req.catch()])
                  window.location = '/'
                } else {
                  showDialog('There was a problem deleting your account. Try again later.')
                }
              } catch (e) {
                log.error('Error deleting account', e.message, e)
                showDialog('There was a problem deleting your account. Try again later.')
              }
            },
          },
        ],
      }),
    [API, showDialog, store, theme]
  )
