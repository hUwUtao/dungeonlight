import ReactDOM from "react-dom/client";
import GameView from "./view";
import "./styles/main.css";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <GameView />
);
