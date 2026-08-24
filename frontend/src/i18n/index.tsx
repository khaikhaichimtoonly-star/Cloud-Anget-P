/**
 * Provider i18n. Chỉ export component để `eslint-plugin-react-refresh` yên tâm;
 * hook `useT` nằm ở `./context`.
 *
 * Mặc định tiếng Việt. Nếu thiếu khoá ở bản đang chọn thì rơi về tiếng Việt,
 * cuối cùng mới trả lại chính khoá — để lỗi thiếu chữ nhìn thấy được ngay chứ
 * không biến thành ô trống.
 */
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import vi from './vi'
import en from './en'
import { I18nContext, interpolate, lookup, type Lang, type TKey, type TVars } from './context'

const DICTS: Record<Lang, unknown> = { vi, en }

const LANG_KEY = 'agent-box:lang'

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'vi'
  return window.localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'vi'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    if (typeof window !== 'undefined') window.localStorage.setItem(LANG_KEY, next)
  }, [])

  const t = useCallback(
    (key: TKey, vars?: TVars) => {
      const template = lookup(DICTS[lang], key) ?? lookup(vi, key) ?? key
      return interpolate(template, vars)
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
