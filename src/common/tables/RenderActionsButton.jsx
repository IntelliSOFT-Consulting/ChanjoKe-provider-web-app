export default function RenderActionButton(actions) {
  return actions.map((action, index) => (
    <button key={index} className="text-[#163C94] px-2 py-1" onClick={() => handleActionClick(action)}>
      {action.charAt(0).toUpperCase() + action.slice(1)}
    </button>
  ));
}

function handleActionClick(action) {
  // Handle the action click here
  console.log(`Clicked ${action}`);
}