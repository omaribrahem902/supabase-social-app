import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailFieldIsOpen, setEmailFieldIsOpen] = useState<boolean>(false);
  const {user,signInWithGitHub,signInWithOTP,signOut} = useAuth();

  const displayName = user?.user_metadata.user_name || user?.email;

  const handleLogin = async () => {
    setLoading(true);
  
    try {
      const { error } = await signInWithOTP(email);
  
      if (error) {
        toast.error(error.message, {
          duration: 4000,
        });
      } else {
        toast.success("Magic link sent! Check your email.", {
          duration: 4000,
        });
      }
    } catch (err: any) {
      toast.error("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
      setEmailFieldIsOpen(false);
    }
  };
  
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <Toaster/>
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            social<span className="text-purple-500">.app</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Community
            </Link>

          
          </div>
          {/* Desktop Auth */}
          <div className="text-white text-[12px] ">
            {user? (
              <div className="flex gap-2 lg:gap-4 cursor-pointer">
                <Link className="flex items-center gap-2" to={`/profile/${user.id}`}>
                  {user.user_metadata.avatar_url &&<img className="rounded-full w-7 h-7" src={user.user_metadata.avatar_url} alt="avatar image" />}
                  <span className="flex items-center">{displayName}</span>
                </Link>
                <button className="hidden md:block bg-red-600 hover:bg-red-700 rounded-md py-1 px-3 cursor-pointer" onClick={signOut}>SignOut</button>
              </div>
            ):(
              <div className="flex gap-2 lg:gap-4">
                <button className="hidden md:block bg-green-600 hover:bg-green-700 rounded-md py-1 px-3 cursor-pointer" onClick={()=>signInWithGitHub()}>Sign In With Github</button>
                <button className="bg-green-600 hover:bg-green-700 rounded-md py-1 px-3 cursor-pointer" onClick={()=>setEmailFieldIsOpen(true)}>Sign In With Magic Link</button>
              </div>
            )}
          </div>

          {/* Magic Link Auth */}
          {emailFieldIsOpen && (
          <div className="absolute top-[68px] right-0 flex items-center gap-2 bg-white rounded-md py-1 px-2 shadow-sm">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              required
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-6 p-1 border rounded-md"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-fit bg-green-500 text-white rounded-md hover:bg-green-600 text-[14px] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>
            <button onClick={()=>setEmailFieldIsOpen(false)} className="h-fit bg-gray-100 hover:bg-gray-200 rounded-md py-[2px] px-2 text-[14px] cursor-pointer">Close</button>
          </div>
          )}


          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="text-white px-2 pt-2 pb-3 space-y-1">
            {!user && (
              <div className="flex gap-2">
              <button className="bg-green-600 hover:bg-green-700 rounded-md py-1 px-3 cursor-pointer" onClick={()=>signInWithGitHub()}>Sign In With Github</button>
              </div>
            )}
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={()=>setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={()=>setMenuOpen(false)}
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={()=>setMenuOpen(false)}
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={()=>setMenuOpen(false)}
            >
              Create Community
            </Link>
            {user && (<button className="text-[14px] bg-red-600 hover:bg-red-700 rounded-md ml-3 my-2 py-1 px-3 cursor-pointer" onClick={signOut}>SignOut</button>)}
          </div>
        </div>
      )}
    </nav>
  );
};
