import { SignInButton } from "@/components/auth/sign-in-button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-neutral-900 items-center justify-center px-24">
      <header className="flex justify-end w-full max-w-7xl py-4">
        <SignInButton />
      </header>
      <div className="min-h-screen text-white w-full max-w-7xl">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-neutral-900 to-neutral-800">
          <div className="text-center">
            <h1 className="text-[4.5rem] font-extrabold mb-5 leading-tight bg-gradient-to-r from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
              Learn Sign Language
              <span className="block text-[5rem] bg-gradient-to-r from-[#FF4081] to-[#FF9100] bg-clip-text text-transparent">
                Interactively
              </span>
            </h1>
            <p className="text-2xl mb-10 text-[#cccccc]">
              Master sign language through real-time feedback and gamified
              learning
            </p>

            <Link
              href="/spell"
              className="inline-block px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-[#4CAF50] to-[#2196F3] rounded-full no-underline transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="text-[40px]">Start Learning Now</span>
            </Link>
          </div>
          <div className="flex gap-[60px] mt-[60px]">
            <div className="flex flex-col items-center">
              <span className="text-[2.5rem] font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
                Privacy
              </span>
              <span className="text-center text-[1.1rem] text-[#cccccc]">
                AIs are always listening to what you say, <br />
                there is always a mic around, use sign language
                <br /> to escape AI surveillance
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[2.5rem] font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
                Universal
              </span>
              <span className="text-center text-[1.1rem] text-[#cccccc]">
                <span>
                  <s>Everyone has hands</s>
                </span>{" "}
                <br />
                Communicate with anyone <br />
                regardless of their native language
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[2.5rem] font-bold bg-gradient-to-r from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
                Inclusive
              </span>
              <span className="text-center text-[1.1rem] text-[#cccccc]">
                Connect with the deaf community and <br />
                break down communication barriers.
              </span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-[100px] bg-neutral-to-neutral-800">
          <h2 className="text-[2.5rem] text-center mb-[60px] bg-gradient-to-r from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[30px] max-w-[1200px] mx-auto px-5">
            <div className="bg-neutral-900 p-[30px] rounded-[15px] text-center transition-transform duration-300 cursor-pointer hover:-translate-y-[10px]">
              <div className="text-[3rem] mb-5">🎯</div>
              <h3 className="text-2xl mb-4 text-white">Real-time Feedback</h3>
              <p className="text-[#cccccc] leading-relaxed">
                Get instant feedback on your hand signs with our advanced AI
                technology
              </p>
            </div>
            <div className="bg-neutral-900 p-[30px] rounded-[15px] text-center transition-transform duration-300 cursor-pointer hover:-translate-y-[10px]">
              <div className="text-[3rem] mb-5">🎮</div>
              <h3 className="text-2xl mb-4 text-white">Gamified Learning</h3>
              <p className="text-[#cccccc] leading-relaxed">
                Learn through fun, interactive exercises and track your progress
              </p>
            </div>
            <div className="bg-neutral-900 p-[30px] rounded-[15px] text-center transition-transform duration-300 cursor-pointer hover:-translate-y-[10px]">
              <div className="text-[3rem] mb-5">📈</div>
              <h3 className="text-2xl mb-4 text-white">
                Progressive Difficulty
              </h3>
              <p className="text-[#cccccc] leading-relaxed">
                Start with basics and gradually advance to more complex signs
              </p>
            </div>
            <div className="bg-neutral-900 p-[30px] rounded-[15px] text-center transition-transform duration-300 cursor-pointer hover:-translate-y-[10px]">
              <div className="text-[3rem] mb-5">🌐</div>
              <h3 className="text-2xl mb-4 text-white">Accessible Anywhere</h3>
              <p className="text-[#cccccc] leading-relaxed">
                Practice from any device with a camera and internet connection
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-[100px] bg-gradient-to-br from-neutral-900 to-neutral-800">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-[3rem] mb-5 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-10 text-[#cccccc]">
              Join thousands of others learning sign language in a fun and
              interactive way
            </p>
            <Link
              href="/spell"
              className="inline-block px-10 py-4 text-xl font-bold text-white bg-gradient-to-r from-[#4CAF50] to-[#2196F3] rounded-full no-underline transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl"
            >
              Begin Learning
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
