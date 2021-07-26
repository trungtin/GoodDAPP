//@flow
import { default as goodWallet } from '../wallet/GoodWallet'
import getDB from '../realmdb/RealmDB'
import { ProfileField, UserStorage } from './UserStorageClass'
import UserProperties from './UserProperties'

const db = getDB()

const userStorage = new UserStorage(goodWallet, db, new UserProperties(db))
global.userStorage = userStorage

type ACK = {
  ok: number,
  err: string,
}

type FieldPrivacy = 'private' | 'public' | 'masked'

export interface DB {
  init(privateKey: string, publicKey: string): void;
  write(feeditem): Promise<void>;
  read(id: string): Promise<any>;
  readByPaymentId(paymentId: string): Promise<any>;
  encryptSettings(settings: object): Promise<any>;
  decryptSettings(): Promise<object>;
  getFeedPage(numResults, offset): Promise<Array<object>>;
}

export interface ProfileActions {
  removeAvatar(withCleanup?: boolean): Promise<(void | ACK)[]>;
  _storeAvatar(field: string, avatar: string, withCleanup?: boolean): Promise<string>;
  _removeBase64(field: string, updateGUNCallback?: Promise<void>): Promise<void>;
  initProfile(): Promise<void>;
  getProfileFieldValue(field: string): Promise<string>;
  getProfileFieldDisplayValue(field: string): Promise<string>;
  getProfileField(field: string): Promise<ProfileField>;
  getDisplayProfile(profile: any): any;
  getPrivateProfile(profile: any): Promise<any>;

  // subscribeProfileUpdates
  // unSubscribeProfileUpdates
  getFieldPrivacy(field: string): Promise<any>;
  setProfile(profile: any, update?: boolean): Promise<any>;
  validateProfile(
    profile: any,
  ): Promise<{
    isValid: boolean,
    errors: {},
  }>;
  setProfileField(field: string, value: string, privacy?: FieldPrivacy, onlyPrivacy?: boolean): Promise<ACK>;

  // indexProfileField(field: string, value: string, privacy: FieldPrivacy): Promise<ACK>;
  setProfileFieldPrivacy(field: string, privacy: FieldPrivacy): Promise<ACK>;
  isUsername(username: string): Promise<boolean>;

  // getUserProfilePublickey(value: string): Promise<any>;
  // getUserAddress(field: string): string;
  getUserProfile(field?: string): { name: String, avatar: String };

  // _getProfileNodeTrusted(initiatorType, initiator, address): Gun
  // _getProfileNode(initiatorType, initiator, address): Gun
  getProfile(): Promise<any>;

  // getEncryptedProfile(profileNode): Promise<any>;
  // getPublicProfile(): Promise<any>;
  deleteProfile(): Promise<boolean>;

  // deleteAccount(): Promise<boolean>;
}

export default userStorage
