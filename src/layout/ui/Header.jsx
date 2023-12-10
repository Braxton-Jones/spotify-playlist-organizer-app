import styles from "./header.module.scss";
export default function Header(props) {
  return (
    <section className={styles.header}>
      <div className={styles.logo}>.setlist - spotify playlist manager</div>
      <div className={styles.icons_wrapper}>
        <div
          style={{
            backgroundImage: `url(${props.userInfo.images[1].url || ""})`,
            backgroundSize: "contain",
            width: "40px",
            height: "40px",
            borderRadius: "10px",
          }}
        ></div>

        <div className={styles.icon}></div>
        <div className={styles.icon}></div>
      </div>
    </section>
  );
}
