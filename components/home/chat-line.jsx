import { BookOpenIcon, UserIcon } from '@heroicons/react/24/outline'

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div
    className="border-b border-black/10 bg-[#F8F8F8] text-black"
  >
    <div
      className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl"
    >
      <div className="min-w-[30px] ml-4">
        <BookOpenIcon />
      </div>
      <span className="animate-pulse cursor-default mt-1">▍</span>
    </div>
  </div >
)

// util helper to convert new lines to <br /> tags
const convertNewLines = (text) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

export function ChatLine({ role = 'assistant', content, isStreaming }) {
  if (!content) {
    return null
  }
  const contentWithCursor = `${content}${isStreaming ? '▍' : ''}`
  const formatteMessage = convertNewLines(contentWithCursor)

  return (
    <div
      className={
        role === 'assistant'
          ? "border-b border-black/10 bg-[#F8F8F8] text-black"
          : "border-b border-black/10 bg-[#F8F8F8] text-black"
      }
    >
      <div
        className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl"
      >
        <div className="min-w-[30px] ml-4">
          {role === 'assistant'
            ? (
              <BookOpenIcon />
            )
            : (
              <UserIcon />
            )
          }
        </div>

        <div className="prose whitespace-pre-wrap flex-1 text-black text-base antialiased">
          {formatteMessage}
        </div>
      </div>
    </div>
  )
}
