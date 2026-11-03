import { GridComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-grids';
import type { ReactNode } from 'react';

/* Read-only Grid wrapper: no paging/sorting (source tables are minimal),
   `num` customAttributes for right alignment, row click via recordClick. */

export interface SfGridColumn {
  field: string;
  headerText: string;
  width?: number | string;
  template?: (data: Record<string, unknown>) => ReactNode;
  textAlign?: 'Left' | 'Right' | 'Center';
  customAttributes?: Record<string, string>;
}

export function SfGrid({ dataSource, columns, onRowClick, cssClass }: {
  dataSource: Record<string, unknown>[];
  columns: SfGridColumn[];
  onRowClick?: (data: Record<string, unknown>) => void;
  cssClass?: string;
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <GridComponent
        dataSource={dataSource}
        allowPaging={false}
        allowSorting={false}
        allowFiltering={false}
        allowSelection={false}
        cssClass={`cdp-grid${cssClass ? ' ' + cssClass : ''}`}
        style={{ display: 'block' }}
        recordClick={(onRowClick ? (args: Record<string, unknown>) => {
          const data = args.rowData as Record<string, unknown>;
          onRowClick(data);
        } : undefined) as never}
      >
        <ColumnsDirective>
          {columns.map((c) => (
            <ColumnDirective
              key={c.field}
              field={c.field}
              headerText={c.headerText}
              width={c.width}
              textAlign={c.textAlign ?? 'Left'}
              customAttributes={{ ...(c.textAlign === 'Right' ? { class: 'num' } : {}), ...(c.customAttributes || {}) }}
              template={c.template ? (c.template as never) : undefined}
            />
          ))}
        </ColumnsDirective>
      </GridComponent>
    </div>
  );
}