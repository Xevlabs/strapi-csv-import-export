declare module 'is-hotkey' {
  export type HotKey = string | string[];
  export type KeyboardEventLike = Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey'>;
  const isHotkey: (hotkey: HotKey, event: KeyboardEventLike | Event) => boolean;
  export default isHotkey;
}
