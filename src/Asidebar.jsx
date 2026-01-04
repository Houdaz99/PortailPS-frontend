import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cnss1 from "./assets/cnss1.png";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import {
  AiOutlineHome,
  AiOutlineMedicineBox,
  AiOutlineFileSearch,
  AiOutlineFileText,
  AiOutlineFolderOpen,
  AiOutlinePlus,
  AiOutlineSetting,
} from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

export default function Asidebar() {
  // État pour contrôler l'ouverture/fermeture de la sidebar
  const [open, setOpen] = useState(true);

  // État pour contrôler quel sous-menu est ouvert
  const [submenuOpenIndex, setSubmenuOpenIndex] = useState(null);

  // État pour stocker les menus à afficher dynamiquement
  const [menus, setMenus] = useState([]);

  /**
   * Définition de toutes les configurations de menus disponibles :
   * - default : utilisé lorsqu'aucun contexte spécifique n'est défini
   * - paiement : accès aux fonctionnalités de remboursement et paiement
   * - pec : accès aux fonctionnalités de prise en charge et droits assurés
   */
  const menuOptions = {
    default: [{ title: "Accueil", icon: <AiOutlineHome />, path: "/" }],
    paiement: [
      { title: "Accueil", icon: <AiOutlineHome />, path: "/" },
      {
        title: "Remboursement",
        icon: <AiOutlineMedicineBox />,
        submenu: true,
        submenuItems: [
          { title: "Suivi des dossiers", icon: <AiOutlineFileSearch />, path: "/SuiviDossierPage" },
          { title: "Récapitulatif", icon: <AiOutlineFileText />, path: "/Récapitulatif" },
        ],
      },
      {
        title: "Paiement",
        icon: <AiOutlineMedicineBox />,
        submenu: true,
        submenuItems: [
          { title: "Détails des paiements", icon: <AiOutlineFileSearch />, path: "/DétailsDespaiements" },
          { title: "Par date d’émission", icon: <AiOutlineFileText />, path: "/ParDateémission" },
        ],
      },
      {
        title: "Sous Comptes",
        icon: <AiOutlineFolderOpen />,
        submenu: true,
        submenuItems: [
          { title: "Création", icon: <AiOutlinePlus />, path: "/CréationSouscompt" },
          { title: "Gestion", icon: <AiOutlineSetting />, path: "/GéstionSousCompte" },
        ],
      },
      { title: "Déconnexion", icon: <FiLogOut />, path: "/logout" },
    ],
    pec: [
      { title: "Accueil", icon: <AiOutlineHome />, path: "/" },
      { title: "Droits des assurés", icon: <AiOutlineHome />, path: "/Assuré" },
      {
        title: "Prise en charge",
        icon: <AiOutlineMedicineBox />,
        submenu: true,
        submenuItems: [
          { title: "Détails du suivi des demandes", icon: <AiOutlineFileSearch />, path: "/Suividesdemandes" },
          { title: "Récapitulatif", icon: <AiOutlineFileText />, path: "/Recapitulatif1" },
        ],
      },
      {
        title: "Sous Comptes",
        icon: <AiOutlineFolderOpen />,
        submenu: true,
        submenuItems: [
          { title: "Création", icon: <AiOutlinePlus />, path: "/CréationSouscompt1" },
          { title: "Gestion", icon: <AiOutlineSetting />, path: "/GéstionSousCompte1" },
        ],
      },
      { title: "Déconnexion", icon: <FiLogOut />, path: "/logout1" },
    ],
  };

  /**
   * Chargement du menu sélectionné au montage du composant.
   * Priorité au menu sauvegardé dans le localStorage.
   */
  useEffect(() => {
    const savedMenu = localStorage.getItem("selectedMenu");
    if (savedMenu && menuOptions[savedMenu]) {
      setMenus(menuOptions[savedMenu]);
    } else {
      setMenus(menuOptions.default);
    }
  }, []);

  // Gère l'ouverture ou la fermeture d'un sous-menu
  const toggleSubmenu = (index) => {
    setSubmenuOpenIndex(submenuOpenIndex === index ? null : index);
  };

  return (
    <div className={`bg-blue-900 h-screen p-5 pt-8 ${open ? "w-72" : "w-20"} duration-300 relative`}>
      {/* Bouton pour réduire/étendre la sidebar */}
      <BsArrowLeftShort
        className={`bg-white text-blue-300 text-3xl rounded-full absolute -right-3 top-9 border border-blue-300 cursor-pointer ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />

      {/* Logo CNSS */}
      <div className={`flex justify-center items-center mb-4 ${open ? "w-full" : ""}`}>
        <img
          src={cnss1}
          alt="logo"
          className={`rounded cursor-pointer duration-500 ${open ? "w-[60px] h-[60px]" : "w-[40px] h-[40px]"}`}
        />
      </div>

      {/* Liste des menus */}
      <ul className="pt-2">
        {menus.map((menu, index) => (
          <React.Fragment key={index}>
            {/* Élément de menu principal */}
            <li className="text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-blue-800 rounded-md mt-4">
              <Link to={menu.path || "#"} className="flex items-center w-full">
                <span className={`text-2xl block float-left ${menu.title === "Déconnexion" ? "ml-0" : ""}`}>
                  {menu.icon ? menu.icon : <RiDashboardFill />}
                </span>
                <span
                  className={`text-base font-medium flex-1 duration-200 ${!open && "hidden"} ${menu.title === "Déconnexion" ? "ml-0" : ""}`}
                >
                  {menu.title}
                </span>
              </Link>

              {/* Chevron pour sous-menus */}
              {menu.submenu && open && (
                <BsChevronDown
                  className={`transition-transform ${submenuOpenIndex === index ? "rotate-180" : ""}`}
                  onClick={() => toggleSubmenu(index)}
                />
              )}
            </li>

            {/* Sous-menu affiché si sélectionné */}
            {menu.submenu && submenuOpenIndex === index && open && (
              <ul className="ml-6">
                {menu.submenuItems?.map((submenuItem, subIndex) => (
                  <li
                    key={`${index}-${subIndex}`}
                    className="text-gray-200 text-base flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-blue-700 rounded-md mt-2"
                  >
                    <Link to={submenuItem.path || "#"} className="flex items-center w-full">
                      <span className="text-xl">{submenuItem.icon}</span>
                      <span>{submenuItem.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
