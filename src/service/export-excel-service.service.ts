import { Injectable } from '@angular/core';
import * as Excel from 'exceljs';
import * as fs from 'file-saver';
import { throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelServiceService {
  headline_row_height: number = 33;
  normal_row_height: number = 25;
  data_font_size: number = 9;

  constructor() { }

  // ===========================================================================
  // MAIN FUNCTIONS
  // ===========================================================================

  newWorkbook() {
    return new Excel.Workbook();
  }

  async generateDefaultExcelHeader(dataBook: Excel.Workbook, dataSheet: Excel.Worksheet, headerLength: number, logo?: string | undefined) {
    const letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
      'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ'
    ];
    this.addEmptyRow(dataSheet);

    this.mergeCell(dataSheet, `A1:${letters[headerLength]}1`,);                           // 'ព្រះរាជាណាចក្រកម្ពុជា'
    this.mergeCell(dataSheet, `A2:${letters[headerLength]}2`,);                           // 'ជាតិ សាសនា ព្រះមហាក្សត្រ'
    this.mergeCell(dataSheet, `A3:${letters[headerLength]}3`,);                           // divider sign
    this.mergeCell(dataSheet, `A4:${letters[headerLength]}4`);                           // ' '
    this.mergeCell(dataSheet, `A5:${letters[headerLength]}5`);                           // ' '
    this.mergeCell(dataSheet, `A6:${letters[headerLength]}6`);                           // ' '
    this.mergeCell(dataSheet, `A7:${letters[headerLength]}7`, {x: 'center', y: 'middle'}); // logo desc: 'បេឡាជាតិសន្តិសុខសង្គម'
    this.mergeCell(dataSheet, `A8:${letters[headerLength]}8`, {x: 'center', y: 'middle'}); // logo desc: 'ប្រព័ន្ធផ្ទៀងផ្ទាត់គណនេយ្យ'
    this.mergeCell(dataSheet, `A9:${letters[headerLength]}9`);                           // first row header
    this.mergeCell(dataSheet, `A10:${letters[headerLength]}10`);                         // second row header
    this.mergeCell(dataSheet, `A11:${letters[headerLength]}11`);                         // left empty space before actuall body content

    const title_1 = 'ព្រះរាជាណាចក្រកម្ពុជា';
    this.setTitle(dataSheet, 'A1', title_1, { font_size: 16, font_family: 'Khmer OS Muol Light', row_height: this.headline_row_height });

    const title_2 = 'ជាតិ សាសនា ព្រះមហាក្សត្រ';
    this.setTitle(dataSheet, 'A2', title_2, { font_size: 14, font_family: 'Khmer OS Muol Light', row_height: this.headline_row_height });

    const divider = 6;
    this.setDivider(dataSheet, 'A3', { value: divider, font_size: 72, });

    const logo_desc_1 = '          បេឡាជាតិសន្តិសុខសង្គម';
    this.setTitle(dataSheet, `A7`, logo_desc_1, { font_size: 12, font_family: 'Khmer OS Muol Light', row_height: this.headline_row_height });

    const logo_desc_2 = '                ប្រព័ន្ធផ្ទៀងផ្ទាត់គណនេយ្យ';
    this.setTitle(dataSheet, `A8`, logo_desc_2, { font_size: 10, font_family: 'Khmer OS Muol Light', row_height: this.headline_row_height });

    if (logo) {
      this.setImage(dataBook, dataSheet, logo, 'png');

    } else {
      try {
        await this.fetchBase64('/assets/images/Logo_NSSF.png')
          .then(res => {
            const base64 = res as string;
            this.setImage(dataBook, dataSheet, base64, 'png');
          })
          .catch(error => {
            throwError(() => error);

          })

      } catch (error) {
        throwError(() => error);

      }
    }

    // set row height
    for (let i of [4, 5, 6, 7, 8, 9, 10, 11]) {
      dataSheet.getRow(i).height = this.normal_row_height;
    }
  }

  generateTableHeader(row: Excel.Row, add_border: boolean = false, align: ICellAlign = { x: 'left', y: 'middle' }) {
    row.height = this.normal_row_height;
    row.alignment = { horizontal: align.x, vertical: align.y, wrapText: true };
    row.eachCell((cell) => {
      if (add_border) {
        cell.border = {
          top: { style: 'thin', color: { argb: '9D9D9D' } },
          left: { style: 'thin', color: { argb: '9D9D9D' } },
          bottom: { style: 'thin', color: { argb: '9D9D9D' } },
          right: { style: 'thin', color: { argb: '9D9D9D' } },
        };
      }

      cell.font = {
        name: 'Khmer OS Battambang',
        color: { argb: '000' },
        size: this.data_font_size,
        bold: true
      };
    });
  }

  generateTableData(export_data: any, data_sheet: Excel.Worksheet, align: ICellAlign = { x: 'center', y: 'middle' }) {
    export_data.forEach((data: any) => {
      const data_row = data_sheet.addRow(data);
      // data_row.height = this.normal_row_height;
      data_row.eachCell((cell) => {
        cell.border = {
          left: { style: 'thin', color: { argb: '9D9D9D' } },
          bottom: { style: 'thin', color: { argb: '9D9D9D' } },
          right: { style: 'thin', color: { argb: '9D9D9D' } },
        };

        cell.font = {
          name: 'Khmer OS Battambang',
          size: this.data_font_size,
          bold: false,
          color: { argb: '000' },
        }

        cell.alignment = {
          horizontal: align.x,
          vertical: align.y,
          wrapText: true
        };
      });
    });
  }

  // add new column data 
  generateCustomTableData(
    export_data: any,
    data_sheet: Excel.Worksheet,
    align: ICellAlign = { x: 'center', y: 'middle' },
    additional_column_data?: any[] // New data for the last column
  ) {
    export_data.forEach((data: any, rowIndex: number) => {
      const data_row = data_sheet.addRow(data);
  
      // Add normal styles for the row
      data_row.eachCell((cell) => {
        cell.border = {
          left: { style: 'thin', color: { argb: '9D9D9D' } },
          bottom: { style: 'thin', color: { argb: '9D9D9D' } },
          right: { style: 'thin', color: { argb: '9D9D9D' } },
        };
  
        cell.font = {
          name: 'Khmer OS Battambang',
          size: this.data_font_size,
          bold: false,
          color: { argb: '000' },
        };
  
        cell.alignment = {
          horizontal: align.x,
          vertical: align.y,
          wrapText: true,
        };
      });
  
      // If additional column data is provided, add it to the last column
      if (additional_column_data && additional_column_data[rowIndex] !== undefined) {
        const lastColumnIndex = data_row.cellCount + 1; // Calculate the next available column index
        const newCell = data_row.getCell(lastColumnIndex);
  
        // Add the new data and style for the additional column
        newCell.value = additional_column_data[rowIndex];
        newCell.border = {
          left: { style: 'thin', color: { argb: '9D9D9D' } },
          bottom: { style: 'thin', color: { argb: '9D9D9D' } },
          right: { style: 'thin', color: { argb: '9D9D9D' } },
        };
  
        newCell.font = {
          name: 'Khmer OS Battambang',
          size: this.data_font_size,
          bold: false,
          color: { argb: '000' },
        };
  
        newCell.alignment = {
          horizontal: align.x,
          vertical: align.y,
          wrapText: true,
        };
      }
    });
  }
  

  // data display form value A14
  generateTableDataWithBoldTotal(export_data: any, data_sheet: Excel.Worksheet, type?: string) {
    let rowNums: number[] = [];
    export_data.forEach((data: any, index: number) => {
      const isLastRow = index === export_data.length - 1;
      const data_row = data_sheet.addRow(data);
      rowNums.push(data_row.number)

      data_row.height = this.normal_row_height;
      data_row.eachCell((cell) => {
        cell.border = {
          left: { style: 'thin', color: { argb: '9D9D9D' } },
          bottom: { style: 'thin', color: { argb: '9D9D9D' } },
          right: { style: 'thin', color: { argb: '9D9D9D' } },
        };

        cell.font = {
          name: 'Khmer OS Battambang',
          size: this.data_font_size,
          bold: isLastRow ? true : false,
          color: { argb: '000' },
        }

        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        };
      });
    });


    if (type == "MAIN" || type == "WI") {
      /**
       * Merge Table Data Row
       */
      for(let i = 0; i < rowNums.length; i++ ) {
        /**
         * Case Last Row Which is Total
         */
        if((i + 1) == (rowNums.length)) {
          this.mergeCellCenter(data_sheet, `A${rowNums[i]}:C${rowNums[i]}`);
        }

        /**
         * Case: Row index is Odd
         * We merge with next data row
         */
        if((i %2 === 0) && !((i + 1) == (rowNums.length))) {
          this.mergeCellCenter(data_sheet, `A${rowNums[i]}:A${rowNums[i+1]}`);
          this.mergeCellCenter(data_sheet, `B${rowNums[i]}:B${rowNums[i+1]}`);
        }
      }
    }

    if (type === "HC") {
      //  It's not Dinamic yet this is just one Element of Array Summary HC
      /**
       * @todo
       * Make it Dynamic
       * Loop through data and check if it arrive merge step
       */
      let mergeStep = 4;
      this.mergeCellCenter(data_sheet, `A${rowNums[0]}:A${rowNums[0] + mergeStep -1 }`);
      this.mergeCellCenter(data_sheet, `B${rowNums[0]}:B${rowNums[0] + mergeStep -1}`);
      this.mergeCellCenter(data_sheet, `A${rowNums[rowNums.length -1]}:C${rowNums[rowNums.length -1]}`);
    }
  }
  // data display form value A13
  generateTableDataWithBold(export_data: any, data_sheet: Excel.Worksheet, type?: string, dataStartRow: number = 13) {
    let rowNums: number[] = [];

    export_data.forEach((data: any, index: number) => {
      const isLastRow = index === export_data.length - 1;
      const rowIndex = dataStartRow + index; // Calculate the row index based on the start row
      const data_row = data_sheet.insertRow(rowIndex, data); // Insert row at the specified index
      rowNums.push(data_row.number);

      data_row.height = this.normal_row_height;
      data_row.eachCell((cell) => {
        cell.border = {
          left: { style: 'thin', color: { argb: '9D9D9D' } },
          bottom: { style: 'thin', color: { argb: '9D9D9D' } },
          right: { style: 'thin', color: { argb: '9D9D9D' } },
        };

        cell.font = {
          name: 'Khmer OS Battambang',
          size: this.data_font_size,
          bold: isLastRow ? true : false,
          color: { argb: '000' },
        };

        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        };
      });
    });

    if (type == "MAIN" || type == "WI") {
      /**
       * Merge Table Data Row
       */
      for(let i = 0; i < rowNums.length; i++ ) {
        /**
         * Case Last Row Which is Total
         */
        if((i + 1) == (rowNums.length)) {
          this.mergeCellCenter(data_sheet, `A${rowNums[i]}:C${rowNums[i]}`);
        }

        /**
         * Case: Row index is Odd
         * We merge with next data row
         */
        if((i %2 === 0) && !((i + 1) == (rowNums.length))) {
          this.mergeCellCenter(data_sheet, `A${rowNums[i]}:B${rowNums[i+1]}`);
          this.mergeCellCenter(data_sheet, `B${rowNums[i]}:B${rowNums[i+1]}`);
        }
      }
    }

    if (type === "HC") {
      //  It's not Dinamic yet this is just one Element of Array Summary HC
      /**
       * @todo
       * Make it Dynamic
       * Loop through data and check if it arrive merge step
       */
      let mergeStep = 4;
      this.mergeCellCenter(data_sheet, `A${rowNums[0]}:A${rowNums[0] + mergeStep -1 }`);
      this.mergeCellCenter(data_sheet, `B${rowNums[0]}:B${rowNums[0] + mergeStep -1}`);
      this.mergeCellCenter(data_sheet, `A${rowNums[rowNums.length -1]}:C${rowNums[rowNums.length -1]}`);
    }
  }

  async export(dataBook: Excel.Workbook, data_sheet: Excel.Worksheet, name: string) {
    // improve logo position before export
    // ------
    this.leftCell(data_sheet, 'A7');
    this.leftCell(data_sheet, 'A8');


    // Start Export
    // ------
    await dataBook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      fs.saveAs(blob, `${name}.xlsx`);
    });
  }

  mergeCellCenter(dataSheet: Excel.Worksheet, val: string) {
    dataSheet.mergeCells(val);
    dataSheet.getCell(val.split(':')[0]).alignment = { horizontal: 'center', vertical: 'middle' };
  }

  // ===========================================================================
  // EXTRAS FUNCTIONS
  // ===========================================================================

  setTitle(dataSheet: Excel.Worksheet, cell: string | number, value: any, config?: { font_size?: number; font_family?: string; bold?: boolean, row_height?: number, align?: Partial<Excel.Alignment> }) {
    const title_cell = dataSheet.getCell(cell);
    const title_row = parseInt(title_cell.row);

    dataSheet.getRow(title_row).height = config?.row_height || this.normal_row_height;
    title_cell.value = value;
    title_cell.style = {
      alignment: {horizontal: config?.align?.horizontal || 'center', vertical: config?.align?.vertical || 'middle'},
      font: {
        name: config?.font_family || 'Khmer OS Battambang',
        size: config?.font_size || 11,
        bold: config?.bold || false,
        color: { argb: '000' },
      },
    };
  }

  setDivider(dataSheet: Excel.Worksheet, cell: string | number, config?: { value?: number, row_height?: number, font_size?: number }) {
    const divider_cell = dataSheet.getCell(cell);
    const divider_row = dataSheet.getRow(3);
    divider_cell.value = config?.value || 3;
    divider_row.height = config?.row_height || this.normal_row_height;
    divider_cell.style = {
      alignment: { horizontal: 'center', vertical: 'middle' },
      font: {
        name: 'Tacteing',
        size: config?.font_size || 36,
        bold: false,
        color: { argb: '000' },
      },
    };
  }

  setImage(dataBook: Excel.Workbook, dataSheet: Excel.Worksheet, value: string | undefined, ext: 'jpeg' | 'png' | 'gif' = 'png') {
    const logo = dataBook.addImage({
      base64: value,
      extension: ext,
    });

    dataSheet.addImage(logo, {
      tl: { col: 1.2, row: 2 },
      ext: { width: 134, height: 134 },
    });
  }

  mergeCell(dataSheet: Excel.Worksheet, cell: string, align: ICellAlign = { x: 'center', y: 'middle' }) {
    dataSheet.mergeCells(cell);
    dataSheet.getCell(cell.split(':')[0]).alignment = { horizontal: align.x, vertical: align.y };
  }

  autoSetColumnWidth(dataSheet: Excel.Worksheet, config?: { table_header_row?: number, minimalWidth?: number }) {
    dataSheet.columns.forEach((col) => {
      let maxColLength = 0;
      col.eachCell!((cell, row_num: number) => {
        if (row_num > (config?.table_header_row || 12)) {
          maxColLength = Math.max(
            maxColLength,
            config?.minimalWidth || 10,
            cell.value && cell.value.toString().length < 50 ? cell.value.toString().length : 50
          )

        } else {
          maxColLength = Math.max(
            cell.value ? cell.value.toString().length : 0
          )
        }
      });
      col.width = maxColLength + 5;
    })
  }

  centerCol(dataSheet: Excel.Worksheet, cols: Array<string | number> = []) {
    cols.forEach(col => {
      dataSheet.getColumn(col).alignment = { horizontal: 'center', vertical: 'middle' };
    })
  }

  centerCell(dataSheet: Excel.Worksheet, cell: string | number) {
    dataSheet.getCell(cell).alignment = { horizontal: 'center', vertical: 'middle' };
  }

  leftCell(dataSheet: Excel.Worksheet, cell: string | number) {
    dataSheet.getCell(cell).alignment = { horizontal: 'left', vertical: 'middle' };
  }

  addEmptyRow(dataSheet: Excel.Worksheet, rows?: any[][]) {
    const emptyRow = [[], [], [], [], [], [], [], []];
    dataSheet.addRows(rows && rows?.length > 0 ? rows : emptyRow);
  }

  defaultCellStyle(dataSheet: Excel.Worksheet, cell: string | number, align: ICellAlign = { x: 'left', y: 'middle' }) {
    dataSheet.getCell(cell).style = {
      font: {
        name: 'Khmer OS Battambang',
        size: 11,
      bold: true,
        color: { argb: '000' }
      },
      alignment: {
        horizontal: align.x,
        vertical: align.y
      }
    }
  }

  setCollumnWidth(dataSheet: Excel.Worksheet, key: string | number, value: number) {
    dataSheet.getColumn(key).width = value;
  }

  async fetchBase64(imageUrl: string): Promise<string | ArrayBuffer> {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(reader.result!);
      };
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }

  insertSummary(worksheet: Excel.Worksheet, data: Array<{ title: string, rowNum: number }>) {
    data.forEach((item: any) => {
      worksheet.insertRow(item.rowNum, [item.title]);
      worksheet.getRow(item.rowNum).font = { name: 'Khmer OS Battambang', size: 10, bold: false, color: { argb: '000' }, }
      this.mergeCell(worksheet, `A${item.rowNum}:B${item.rowNum}`, { x: "justify", y: "middle" });
    })
  }
}

interface ICellAlign {
  x: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';
  y: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify';
}
