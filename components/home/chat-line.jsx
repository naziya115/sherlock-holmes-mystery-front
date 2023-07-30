import Image from "next/image";

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div
    className="border-b border-black/10 bg-[#F8F8F8] text-black"
  >
    <div
      className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl"
    >
      <div className="min-w-[30px] lg:ml-4">
      <Image
        src="/sherlock-holmes-chat.ico"
        alt="Logo"
        className="h-16 w-16 rounded"
        width={16}
        height={16}
      />
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
          : "border-b border-black/10 bg-white text-black"
      }
    >
      <div
        className="relative m-auto flex p-4 text-base md:max-w-2xl gap-2 md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl"
      >
        <div className="min-w-[30px] lg:ml-4">
          {role === 'assistant'
            ? (
              <Image
                    src="/sherlock-holmes-chat.ico"
                    alt="Logo"
                    className="h-16 w-16 rounded"
                    width={16}
                    height={16}
                  />
            )
            : (
              <Image
              src="/dr-watson-chat.ico"
              alt="Logo"
              className="h-16 w-16 rounded"
              width={16}
              height={16}
            />
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
