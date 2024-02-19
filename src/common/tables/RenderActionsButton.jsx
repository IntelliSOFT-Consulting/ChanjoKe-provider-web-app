import { useNavigate } from "react-router-dom";

export default function RenderActionButton({ actions, onBtnAction }) {
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    if ('url' in action) {
      navigate(action.url);
    }

    if ('btnAction' in action) {
      onBtnAction && onBtnAction({ ...action.btnAction });
    }
  };

  if (Array.isArray(actions)) {
    return actions.map((action, index) => (
      <button key={index} className="text-[#163C94] px-2 py-1" onClick={() => handleActionClick(action)}>
        {action.title.charAt(0).toUpperCase() + action.title.slice(1)}
      </button>
    ));
  }
}