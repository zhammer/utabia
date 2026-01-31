import {
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useMachine } from "@xstate/react";
import { appMachine, VisibleTab } from "../machines/appMachine";
import { useTabs } from "../hooks/useTabs";
import FloatingTab from "./FloatingTab";
import UtabiaScene from "./UtabiaScene";

interface TabFieldProps {
  onShoot: (x: number, y: number, targetInstanceId?: string) => void;
}

export interface TabFieldHandle {
  hitTab: (instanceId: string) => boolean;
}

const TabField = forwardRef<TabFieldHandle, TabFieldProps>(
  ({ onShoot }, ref) => {
    const { tabs, closeTab } = useTabs();
    const [state, send] = useMachine(appMachine);
    const floatingTabRefs = useRef<Map<string, { hit: () => boolean }>>(
      new Map()
    );

    useImperativeHandle(
      ref,
      () => ({
        hitTab: (instanceId: string) => {
          return floatingTabRefs.current.get(instanceId)?.hit() ?? false;
        },
      }),
      []
    );

    // Sync tabs with machine
    useEffect(() => {
      send({ type: "SET_TABS", tabs });
    }, [tabs, send]);

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;

        // Check if clicked on a tab (exclude fading-out tabs)
        const target = e.target as HTMLElement;
        const tabElement = target.closest(".floating-tab:not(.fading-out)");
        const instanceId =
          tabElement?.getAttribute("data-instance-id") || undefined;

        onShoot(x, y, instanceId);
      },
      [onShoot]
    );

    const handleTabGone = useCallback(
      (instanceId: string) => {
        floatingTabRefs.current.delete(instanceId);
        send({ type: "TAB_GONE", instanceId });
      },
      [send]
    );

    const handleTabClosed = useCallback(
      (instanceId: string, tabId: number) => {
        floatingTabRefs.current.delete(instanceId);
        closeTab(tabId);
        send({ type: "TAB_CLOSED", instanceId, tabId });
      },
      [send, closeTab]
    );

    const registerFloatingTab = useCallback(
      (instanceId: string, handle: { hit: () => boolean }) => {
        floatingTabRefs.current.set(instanceId, handle);
      },
      []
    );

    const isShowingMessage = state.matches({ utabia: "showingMessage" });

    return (
      <div className="tab-field" onClick={handleClick}>
        {state.context.visible.map((vTab: VisibleTab) => (
          <FloatingTab
            key={vTab.instanceId}
            tab={vTab}
            instanceId={vTab.instanceId}
            x={vTab.x}
            y={vTab.y}
            onGone={() => handleTabGone(vTab.instanceId)}
            onClosed={() => handleTabClosed(vTab.instanceId, vTab.id)}
            onRegister={(handle) =>
              registerFloatingTab(vTab.instanceId, handle)
            }
          />
        ))}
        {isShowingMessage && <UtabiaScene />}
      </div>
    );
  }
);

TabField.displayName = "TabField";

export default TabField;
