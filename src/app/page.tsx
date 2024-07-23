export default function Home() {
  return (
    <div className="flex flex-col space-y-5">

      {/* Hero Section */}
      <div className="hero h-96">
        <div className="flex flex-col items-center justify-center h-full space-y-10">
          <div className="tagline">
            <h1 className="text-3xl font-bold">Empowering Mental Well-being, One Insight at a Time.</h1>
          </div>
          <div className="description w-[65%]">
            <p className="text-sm">Welcome! Dive into a journey of self-discovery with our free personality test. Uncover insights about yourself and embark on a path to understanding your unique traits. Take the first step towards personal growth and well-being – start your test today!</p>
          </div>
          <div className="button-test">
            <a href="/take-a-test" className="bg-sky-200 rounded-md px-10 py-2 font-bold">
              <button>Take a Test</button>
            </a>
          </div>
        </div>

        {/* Partial Section */}

      </div>
    </div>
  );
}
