import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
@Injectable()
export class apiService{
    url:any = "https://be82e237-b88a-4237-873f-c49ad8dd999f.mock.pstmn.io/service";
    constructor(private http:HttpClient){}
    GenerateOtp(data):any{
          return this.http.post(this.url+"/getOtp",data);
    }
    verifyOtpData(otpdata):any{
      return this.http.post(this.url+"/verifyOtp",otpdata);
    }
  }