import { Button, useSnackbar } from "react-material";

export function BasicSnackbar() {
  const { showSnackbar } = useSnackbar();

  return (
    <Button onClick={() => showSnackbar({ message: "This is a basic snackbar message" })}>
      Show Snackbar
    </Button>
  );
}

export function SnackbarWithAction() {
  const { showSnackbar } = useSnackbar();

  return (
    <Button
      onClick={() =>
        showSnackbar({
          message: "Email sent successfully",
          actionName: "Undo",
          onActionClick: () => console.log("Undo clicked"),
        })
      }>
      Show Snackbar with Action
    </Button>
  );
}

export function SnackbarWithClose() {
  const { showSnackbar } = useSnackbar();

  return (
    <Button
      onClick={() =>
        showSnackbar({
          message: "This snackbar can be manually closed",
          closeable: true,
          autoHideDuration: 0,
        })
      }>
      Show Closeable Snackbar
    </Button>
  );
}

export function StackingSnackbarDemo() {
  const { showSnackbar } = useSnackbar();

  const showMultipleSnackbars = () => {
    showSnackbar({
      message: "First notification",
      autoHideDuration: 3000,
    });

    setTimeout(() => {
      showSnackbar({
        message: "Second notification",
        autoHideDuration: 3000,
      });
    }, 500);

    setTimeout(() => {
      showSnackbar({
        message: "Third notification",
        autoHideDuration: 3000,
      });
    }, 1000);
  };

  return <Button onClick={showMultipleSnackbars}>Show Multiple Snackbars</Button>;
}

export function SnackbarDemoWrapper() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <BasicSnackbar />
        <SnackbarWithAction />
        <SnackbarWithClose />
        <StackingSnackbarDemo />
      </div>

      <div className="text-sm mt-4">
        <p>The snackbar system now uses a context-based approach with stacking support.</p>
        <p>Key features:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Automatic stacking of multiple snackbars</li>
          <li>Configurable maximum number of snackbars shown at once</li>
          <li>Customizable stack direction (up or down)</li>
          <li>Integrated directly into ThemeProvider</li>
        </ul>

        <p className="mt-4">
          Just wrap your app in the ThemeProvider with the root prop set to true:
        </p>
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {`<ThemeProvider 
  root={true}
  maxSnackbars={3}
  snackbarStackDirection="up"
>
  <App />
</ThemeProvider>`}
        </pre>

        <p className="mt-4">Then use the useSnackbar hook anywhere in your app:</p>
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {`import { useSnackbar } from 'react-material';

function MyComponent() {
  const { showSnackbar, hideAllSnackbars } = useSnackbar();
  
  const handleClick = () => {
    // Returns a unique ID you can use to close this specific snackbar
    const snackbarId = showSnackbar({
      message: 'Hello world!',
      actionName: 'Dismiss',
      onActionClick: () => console.log('Dismissed'),
      closeable: true,
      autoHideDuration: 4000
    });
  };
  
  return <Button onClick={handleClick}>Show Snackbar</Button>;
}`}
        </pre>
      </div>
    </div>
  );
}
