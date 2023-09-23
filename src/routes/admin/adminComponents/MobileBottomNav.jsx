import { Link } from "react-router-dom";
import { FaRoute, FaHome } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
export default function MobileBottomNav({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className="btm-nav btm-nav-lg lg:hidden bg-slate-100 z-50 h-12 sm:landscape:hidden">
      <Link as="button" to="/">
        <FaHome className="text-xl" />
      </Link>
      <Link as="button" to="/serviceRoute">
        <FaRoute className="text-xl" />
      </Link>
      <label className="swap swap-rotate" onChange={toggleSidebar}>
        {/* <!-- this hidden checkbox controls the state --> */}
        <input
          type="checkbox"
          className="invisible"
          checked={isSidebarOpen}
          readOnly
        />

        {/* <!-- hamburger icon --> */}
        <AiOutlineMenu className="text-2xl swap-off" />

        {/* <!-- close icon --> */}
        <AiOutlineClose className="text-2xl swap-on" />
      </label>
    </div>
  );
}
