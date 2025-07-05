import { Button, Tooltip, Icon } from "react-material";

export function BasicTooltip() {
  return (
    <Tooltip text="This is a basic tooltip">
      <Button>Hover me</Button>
    </Tooltip>
  );
}

export function TooltipPositions() {
  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-4">
        <Tooltip text="Top tooltip" position="top">
          <Button>Top</Button>
        </Tooltip>
        <Tooltip text="Bottom tooltip" position="bottom">
          <Button>Bottom</Button>
        </Tooltip>
        <Tooltip text="Left tooltip" position="left">
          <Button>Left</Button>
        </Tooltip>
        <Tooltip text="Right tooltip" position="right">
          <Button>Right</Button>
        </Tooltip>
      </div>
    </div>
  );
}

export function TooltipVariants() {
  return (
    <div className="flex gap-4">
      <Tooltip text="Plain tooltip" variant="plain">
        <Button>Plain</Button>
      </Tooltip>
      <Tooltip
        variant="rich"
        header="Feature Update"
        text="New features are now available. Click to learn more about the latest improvements and enhancements."
        actions={[
          { label: "Learn More", onClick: () => alert("Learning more..."), variant: "text" },
        ]}>
        <Button>Rich with Action</Button>
      </Tooltip>
    </div>
  );
}

export function TooltipWithDelay() {
  return (
    <div className="flex gap-4">
      <Tooltip text="Fast tooltip" delay={200}>
        <Button>Fast (200ms)</Button>
      </Tooltip>
      <Tooltip text="Default tooltip" delay={700}>
        <Button>Default (700ms)</Button>
      </Tooltip>
      <Tooltip text="Slow tooltip" delay={1500}>
        <Button>Slow (1500ms)</Button>
      </Tooltip>
    </div>
  );
}

export function DisabledTooltip() {
  return (
    <div className="flex gap-4">
      <Tooltip text="This tooltip is disabled" disabled>
        <Button>Disabled tooltip</Button>
      </Tooltip>
      <Tooltip text="This tooltip is enabled">
        <Button>Enabled tooltip</Button>
      </Tooltip>
    </div>
  );
}

export function RichTooltipWithMultipleActions() {
  return (
    <div className="flex gap-4">
      <Tooltip
        variant="rich"
        header="Confirmation"
        text="Are you sure you want to delete this item?"
        actions={[
          { label: "Cancel", onClick: () => console.log("Cancelled"), variant: "text" },
          { label: "Delete", onClick: () => console.log("Deleted"), variant: "filled" },
        ]}>
        <Button>Delete Item</Button>
      </Tooltip>
    </div>
  );
}
