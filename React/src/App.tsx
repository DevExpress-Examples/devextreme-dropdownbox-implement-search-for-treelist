import {
  useEffect, useMemo, useState,
} from 'react';
import SelectBox from 'devextreme-react/select-box';
import NumberBox from 'devextreme-react/number-box';
import 'devextreme/dist/css/dx.light.css';
import './App.css';
import { type DataSource } from 'devextreme-react/common/data';
import DropDownList from './components/DropDownList/DropDownList.tsx';
import {
  type Employee, type SearchExprItem,
  createTasksDataSource,
  getDisplayExpr,
  getSearchExprItems,
  lookupStore,
} from './service';

const searchExprItems: SearchExprItem[] = getSearchExprItems();

function App(): JSX.Element {
  const [displayExpr, setDisplayExpr] = useState<((item: unknown) => string) | undefined>(undefined);
  const [searchExprValue, setSearchExprValue] = useState<string | string[]>('Employee');
  const [searchTimeout, setSearchTimeout] = useState(1000);

  const dataSource: DataSource = useMemo(() => createTasksDataSource(), []);

  useEffect(() => {
    (lookupStore.load() as Promise<Employee[]>).then((items) => {
      setDisplayExpr(() => (item: unknown) => getDisplayExpr(item as Parameters<typeof getDisplayExpr>[0], items));
      return items;
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load lookup data:', error);
    });
  }, []);

  return (
    <div className="dx-viewport demo-container">
      <div className="row">
        <p>DropDownBox with search and embedded TreeList</p>
        <DropDownList
          selectedRowKey={22}
          dataSource={dataSource}
          dropDownBoxDataSource={dataSource}
          searchTimeout={searchTimeout}
          displayExpr={displayExpr}
          searchExprValue={searchExprValue}
        />
      </div>

      <div className="options">
        <div className="caption">Search Options</div>
        <div className="option">
          <div>Search Expression</div>
          <SelectBox
            items={searchExprItems}
            displayExpr="name"
            valueExpr="value"
            value={searchExprValue}
            onValueChange={setSearchExprValue}
          />
        </div>
        <div className="option">
          <div>Search Timeout</div>
          <NumberBox
            min={0}
            max={10000}
            value={searchTimeout}
            showSpinButtons
            step={100}
            onValueChange={setSearchTimeout}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
