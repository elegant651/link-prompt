export default interface PromptUriDataEntity {
  author?: string;
  created?: number;
  title?: string;
  prompt?: string;
  promptEncryptedString?: string;
  promptEncryptedSymmetricKey?: string;
  imageUrl?: string;
}
