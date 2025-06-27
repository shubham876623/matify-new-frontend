import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosWithRefresh";
import { IoClose } from 'react-icons/io5';
import { FiMenu } from 'react-icons/fi';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Generate");
  const [creditsRemaining, setCreditsRemaining] = useState(0);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    "AI PHOTOSHOOT": [
      {
        name: "Generate",
        icon: "/images/img_label.png",
      },
      {
        name: "Generated Images",
        icon: "/images/img_label_28x24.png",
      },
    ],
    "AI EDITING TOOLS": [
      {
        name: "Object Removal",
        icon: "/images/img_label_1.png",
      },
      {
        name: "Add Accessories",
        icon: "/images/img_label_2.png",
      },
      {
        name: "Outfit Swap",
        icon: "/images/img_label_3.png",
      },
      {
        name: "Background Replace",
        icon: "/images/img_label_4.png",
      },
      {
        name: "Upscale",
        icon: "/images/img_label_5.png",
      },
      {
        name: "Color Correction",
        icon: "/images/img_label_6.png",
      },
    ],
    GALLERY: [
      {
        name: "Saved Images",
        icon: "/images/img_label_7.png",
      },
    ],
    ACCOUNT: [
      {
        name: "Help & Support",
        icon: "🙋‍♀️",
        isEmoji: true,
      },
      {
        name: "Billing",
        icon: "/images/img_label_8.png",
      },
    ],
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    setIsOpen(false);

    switch (itemName) {
      case "Generate":
        navigate("/");
        break;
      case "Generated Images":
        navigate("/generated-images");
        break;
      case "Object Removal":
        navigate("/edit/object-removal");
        break;
      case "Add Accessories":
        navigate("/edit/add-accessories");
        break;
      case "Outfit Swap":
        navigate("/edit/outfit-swap");
        break;
      case "Background Replace":
        navigate("/edit/background-replace");
        break;
      case "Upscale":
        navigate("/edit/upscale");
        break;
      case "Color Correction":
        navigate("/edit/color-correction");
        break;
      case "Saved Images":
        navigate("/gallery");
        break;
      case "Help & Support":
        navigate("/support");
        break;
      case "Billing":
        navigate("/billing");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await api.get("/api/credits/");
        setCreditsRemaining(res.data.credits_remaining);
        setCreditsUsed(res.data.credits_used);
      } catch (err) {
        console.error("Failed to fetch credits", err);
      }
    };
    fetchCredits();
  }, []);

  useEffect(() => {
    const path = location.pathname;

    if (path.includes("/generated-images")) setActiveItem("Generated Images");
    else if (path.includes("/edit/object-removal")) setActiveItem("Object Removal");
    else if (path.includes("/edit/add-accessories")) setActiveItem("Add Accessories");
    else if (path.includes("/edit/outfit-swap")) setActiveItem("Outfit Swap");
    else if (path.includes("/edit/background-replace")) setActiveItem("Background Replace");
    else if (path.includes("/edit/upscale")) setActiveItem("Upscale");
    else if (path.includes("/edit/color-correction")) setActiveItem("Color Correction");
    else if (path.includes("/gallery")) setActiveItem("Saved Images");
    else if (path.includes("/support")) setActiveItem("Help & Support");
    else if (path.includes("/billing")) setActiveItem("Billing");
  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 text-2xl text-black mt-0 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <FiMenu />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`h-full w-[272px] bg-white border-r border-[#f8f8f8] flex flex-col transition-transform duration-300 ease-in-out
          md:relative
          ${isOpen ? 'fixed top-0 left-0 z-50 translate-x-0' : 'fixed top-0 left-0 z-50 -translate-x-full'}
          md:translate-x-0 md:z-auto md:transform-none`}
      >
        {/* Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} className="text-2xl text-black">
            <IoClose />
          </button>
        </div>

        {/* Logo */}
        <div className='flex items-center justify-start w-full gap-4 p-[12px] border-b-black'>
          <img src='/signupimages/matify-logo.svg' alt='Matify-logo' className='w-[3rem] h-[3rem]' />
          <h1 className="text-[1.3rem] leading-[1.2rem] text-black font-extrabold tracking-[0.8rem]">MATIFY</h1>
        </div>
        <div className="h-[0.5px] w-[224px] ml-[14px] bg-[#f2f2f2]"></div>

        {/* Menu Sections */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(menuItems).map(([sectionTitle, items]) => (
            <div key={sectionTitle} className="border-b border-[#f8f8f8]">
              <div className="px-4 py-4">
                <h3 className="text-[0.8rem] font-semibold leading-4 text-[#949494] uppercase font-gilroy mb-4">
                  {sectionTitle}
                </h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleItemClick(item.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeItem === item.name
                          ? "bg-[#272727] text-white"
                          : "text-[#424242] hover:bg-gray-100"
                      }`}
                    >
                      {item.isEmoji ? (
                        <span className="text-[1.25rem] leading-[1.5rem] w-6 h-6 flex items-center justify-center">
                          {item.icon}
                        </span>
                      ) : (
                        <img src={item.icon} alt={item.name} className="w-6 h-6" />
                      )}
                      <span className="text-[1rem] font-medium leading-5 font-gilroy">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Credit Section */}
        <div className="p-4">
          <div className="bg-white border border-[#1cc36b33] rounded-lg p-3 flex items-center gap-3">
            <img
              src="/images/img_frame_1000003690.png"
              alt="credit icon"
              className="w-[2.1rem] h-[2.1rem] rounded-md"
            />
            <div>
              <p className="text-[0.8rem] font-medium leading-4 text-black uppercase font-gilroy">
                REMAINING CREDIT
              </p>
              <p className="text-[1rem] font-semibold leading-5 text-[#1cc26a] font-gilroy">
                {creditsRemaining}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
