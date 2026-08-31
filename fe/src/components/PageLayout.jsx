import { Header } from "./Header";
import { MobileContainer } from "./MobileContainer";
export function PageLayout({
  title,
  children,
  withBottomBar = false
}) {
  return <MobileContainer>
      <div className="flex flex-col h-full bg-[#f9fafb]">
        <Header title={title} />
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${withBottomBar ? 'pb-[95px]' : ''}`}>
          {children}
        </div>
      </div>
    </MobileContainer>;
}