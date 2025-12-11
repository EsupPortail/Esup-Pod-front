import React, { useState } from "react";
import styles from "./page.module.css";
import "./sidebar.css";

const SideBar = (props: any) => {
  let sidebarClass = props.isOpen ? "sidebar open" : "sidebar";

  const onMouseOverCaptureHandler = () => {
    console.log("onMouseOverCapture Event!");
    sidebarClass = "sidebar open";
  };
  const onMouseOutCaptureHandler = () => {
    console.log("onMouseOutCapture Event!");
    sidebarClass = "sidebar";
  };

  return (
    <div
      className={sidebarClass}
      onMouseOverCapture={onMouseOverCaptureHandler}
      onMouseOutCapture={onMouseOutCaptureHandler}
    >
      <div className="">
        <h3
          className={styles.sidebar_menu_title}
          style={{ color: props.isOpen ? "#1167D4" : "white" }}
        >
          Menu principal
        </h3>
        <ul className={styles.main_menu}>
          <li className={styles.menu_item}>
            <span className="material-icons">slideshow</span>
            <a>Consulter les vidéos </a>
          </li>
          <li className={styles.menu_item}>
            <span className="material-icons">live_tv</span>
            <a>Évenements en direct</a>
          </li>
        </ul>
        <ul className={styles.auth_user_menu}>
          <h3
            className={styles.sidebar_menu_title}
            style={{ color: props.isOpen ? "#1167D4" : "white" }}
          >
            Mon menu POD
          </h3>
          <li className={styles.menu_item}>
            <span className="material-icons">add_circle_outline</span>
            <a>Ajouter une vidéo</a>
          </li>
          <li className={styles.menu_item}>
            <span className="material-icons">dashboard</span>
            <a>Mon tableau de bord</a>
          </li>
          <li className={styles.menu_item}>
            <span className="material-icons">groups</span>
            <a>Mes réunions</a>
          </li>
          <li className={styles.menu_item}>
            <span className="material-icons">account_box</span>
            <a>Mon espace</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default SideBar;
