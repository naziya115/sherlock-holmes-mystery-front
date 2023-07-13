import Chat from "./chat";

const StoryGenPage = () => {
  return (
    <>
    <div className="flex flex-column w-full h-[90vh] overflow-auto">
        <div className="flex inset-y-0 left-0 basis-1/2"><Chat/></div>
        <div className="flex inset-y-0 right-0 basis-1/2 p-8 text-black text-lg antialiased">* real-time story generation *</div>
    </div>
   </>
  );
}

export default StoryGenPage;