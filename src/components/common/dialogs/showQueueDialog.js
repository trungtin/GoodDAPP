//@flow

// libraries
import React from 'react'
import { View } from 'react-native'

// custom components
import Text from '../view/Text'

import { store } from '../../../lib/undux/SimpleStore'
import { showDialogWithData } from '../../../lib/undux/utils/dialog'

// utils
import { withStyles } from '../../../lib/styles'

// assets
import ClaimQueueSVG from '../../../assets/Claim/claimQueue.svg'
import { isMobileNative } from '../../../lib/utils/platform'

const styles = () => ({
  wrapper: {
    flex: 1,
  },
  title: {
    borderColor: 'orange',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    paddingTop: 10,
    paddingBottom: 10,
  },
  paddingTop20: {
    paddingTop: 20,
  },
  paddingVertical20: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  textStyle: {
    textAlign: 'left',
    lineHeight: 22,
  },
})

const QueuePopup = withStyles(styles)(({ styles, textComponent }) => {
  const TextComponent = textComponent

  return (
    <View style={styles.wrapper}>
      <View style={styles.title}>
        <Text textAlign="left" fontSize={22} lineHeight={28} fontWeight="medium">
          Good things come to those who wait...
        </Text>
      </View>
      <TextComponent styles={styles} />
    </View>
  )
})

export const showQueueDialog = (textComponent, dialogOptions = {}) => {
  const imageStyle = { marginRight: 'auto', marginLeft: 'auto', width: 177, height: 119 }
  const Image = isMobileNative ? (
    <View style={imageStyle}>
      <ClaimQueueSVG />
    </View>
  ) : (
    <ClaimQueueSVG width="100%" height="100%" viewBox="0 0 180 130" />
  )

  showDialogWithData(store.getCurrentSnapshot(), {
    type: 'queue',
    isMinHeight: true,
    image: Image,
    message: <QueuePopup textComponent={textComponent} />,
    buttons: [
      {
        text: 'OK, Got it',
      },
    ],
    ...dialogOptions,
  })
}
