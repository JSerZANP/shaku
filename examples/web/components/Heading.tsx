import { $ } from "migacss";
import { IoLink } from "react-icons/io5";
import styles from "./Heading.module.css";
export function Heading({
  level,
  title,
  justify = "center",
}: {
  level: "h2" | "h3";
  title: string;
  justify?: "flex-start" | "center";
}) {
  const Component = $[level];
  const id = title.toLowerCase().replace(/\s/g, "-");
  return (
    <Component
      $display="flex"
      $justifyContent={justify}
      $alignItems="center"
      $gap={10}
      id={id}
      className={styles.heading}
    >
      {title}{" "}
      <$.a href={`#${id}`} $display="inline-flex" $alignItems="center">
        <IoLink />
      </$.a>
    </Component>
  );
}
