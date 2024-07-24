import { Button } from "@/components/ui/button";

export default function MonochromeMeet() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="bg-black text-white w-full py-4 flex justify-center">
        <h1 className="text-lg">MonochromeMeet</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <p className="text-center mb-8">Connect with your friends through chat or video call.</p>

        <div className="space-y-4 w-full max-w-xs">
          <Button className="w-full bg-black text-white py-2 rounded-full">
            Start a Chat
          </Button>
          <Button className="w-full bg-black text-white py-2 rounded-full">
            Join a Chat
          </Button>
          <Button className="w-full bg-black text-white py-2 rounded-full">
            Start a Video Call
          </Button>
          <Button className="w-full bg-black text-white py-2 rounded-full">
            Join a Video Call
          </Button>
        </div>
      </main>
    </div>
  );
}
