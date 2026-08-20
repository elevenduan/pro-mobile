import { createRoot } from "react-dom/client";
import { unstableSetRender } from "antd-mobile";
import App from "./App.tsx";

unstableSetRender((node, container: any) => {
  container._reactRoot ||= createRoot(container);
  const root = container._reactRoot;
  root.render(node);
  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

createRoot(document.getElementById("root")!).render(<App />);
