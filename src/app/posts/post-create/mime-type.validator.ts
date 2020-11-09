import { AbstractControl } from '@angular/forms'
import { Observable, Observer, of } from 'rxjs'

export const mimetype = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {

  if(typeof control.value === 'string') {
    return of(null);
  }


  const file = control.value as File;
  const fileReader = new FileReader();

  const fileReaderObservable = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);

      let header = '';
      let isValid = false;

      for(const item of arr) {
        header += item.toString(16);
      }

      switch(header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }

      if(isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true })
      }

      observer.complete();
    });

    fileReader.readAsArrayBuffer(file);
  });

  return fileReaderObservable;
}


// const getMimetype = (signature) => {
//   switch(signature) {
//     case '89504E47':
//       return 'image/png'
//     case '47494638':
//       return 'image/gif'
//     case '25504446':
//       return 'application/pdf'
//     case 'FFD8FFDB':
//     case 'FFD8FFE0':
//     case 'FFD8FFE1':
//       return 'image/jpeg'
//     case '504B0304':
//       return 'application/zip'
//     default:
//       return 'Unknown filetype'
//   }
// }
