import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const ngrokInterceptor: HttpInterceptorFn = (req, next) => {
  
  const HEADER_REQUEST = new HttpHeaders( {'ngrok-skip-browser-warning':'true'} )
  let newReq = req.clone({
    headers: HEADER_REQUEST 
  });
  
  return next(newReq);
};
