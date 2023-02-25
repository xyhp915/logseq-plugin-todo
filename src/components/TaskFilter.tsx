import React from 'react';
import Select, { Theme } from 'react-select';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CircleOff } from 'tabler-icons-react';
import { userConfigsState } from '../state/user-configs';
import { TaskMarker, TaskPriority } from '../models/TaskEntity';
import {
  DEFAULT_OPTION,
  markerFilterState,
  priorityFilterState,
} from '../state/filter';
import { themeStyleState } from '../state/theme';

const PRIORITY_OPTIONS = [
  TaskPriority.HIGH,
  TaskPriority.MEDIUM,
  TaskPriority.LOW,
  TaskPriority.NONE,
];

const TaskFilter: React.FC = () => {
  const { preferredWorkflow } = useRecoilValue(userConfigsState);
  const [marker, setMarker] = useRecoilState(markerFilterState);
  const [priority, setPriority] = useRecoilState(priorityFilterState);
  const themeStyle = useRecoilValue(themeStyleState);

  const workflow = React.useMemo(() => {
    return preferredWorkflow === 'now'
      ? [TaskMarker.NOW, TaskMarker.LATER]
      : [TaskMarker.TODO, TaskMarker.DOING];
  }, [preferredWorkflow]);

  const markerOptions = React.useMemo(() => {
    return workflow.reduce(
      (options, marker) => {
        return [...options, { label: marker, value: marker }];
      },
      [DEFAULT_OPTION],
    );
  }, [workflow]);

  const priorityOptions = React.useMemo(() => {
    return PRIORITY_OPTIONS.reduce(
      (options, marker) => {
        return [...options, { label: marker, value: marker }];
      },
      [DEFAULT_OPTION],
    );
  }, []);

  const selectClassNames = React.useMemo(
    () => ({
      container: () => 'text-xs',
      control: () =>
        '!h-6 !min-h-6 w-14 !border-none !shadow-none !bg-transparent ',
      valueContainer: () => '!py-0 !px-1 cursor-pointer bg-transparent',
      singleValue: () => `!text-gray-600 !dark:text-gray-300`,
      indicatorsContainer: () => '!hidden',
      menu: () => `!-mt-0.5`,
      option: () => `!py-1 !px-2`,
    }),
    [],
  );

  const selectTheme = React.useCallback((theme: Theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: themeStyle.sectionTitleColor,
      primary25: themeStyle.secondaryBackgroundColor,
      neutral0: themeStyle.primaryBackgroundColor,
    }
  }), [themeStyle]);

  const handleReset = () => {
    setMarker(DEFAULT_OPTION);
    setPriority(DEFAULT_OPTION);
  };

  return (
    <div
      className="flex flex-row text-gray-600 dark:text-gray-300 px-2 rounded-b-md items-center justify-between"
      style={{
        backgroundColor: themeStyle.secondaryBackgroundColor,
      }}
    >
      <div className="flex flex-row">
        <div className="flex flex-row items-center">
          <span className="text-xs">Marker:</span>
          <Select
            classNames={selectClassNames}
            theme={selectTheme}
            isSearchable={false}
            options={markerOptions}
            value={marker}
            onChange={(option) => setMarker(option!)}
          />
        </div>
        <div className="flex flex-row items-center">
          <span className="text-xs">Priority:</span>
          <Select
            classNames={selectClassNames}
            theme={selectTheme}
            isSearchable={false}
            options={priorityOptions}
            value={priority}
            onChange={(option) => setPriority(option!)}
          />
        </div>
      </div>
      {(marker.value || priority.value) && (
        <CircleOff size={14} className="stroke-gray-600 dark:stroke-gray-200" onClick={handleReset} />
      )}
    </div>
  );
};

export default TaskFilter;