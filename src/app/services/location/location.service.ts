import { Injectable } from '@angular/core';
import { ApiBaseService } from '../base-api/api-base.service';
import urlConfig from 'src/app/config/url.config.json';
import { locationPayload } from 'src/app/core/constants/payload';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LocationService {

    constructor(private apiService: ApiBaseService) { }
    userId = localStorage.getItem("userId")

    getOptionList(parentId: string, entityType: string) {
        const payload = locationPayload.getOptionList(entityType, parentId, this.userId);

        return this.apiService.post(urlConfig.location.locationUrl, payload).pipe(
            map((res: any) => {
                const result = res?.result?.response || [];
                return result.map((item: any) => ({
                    ...item,
                    label: item.name,
                    value: item.id
                }));
            })
        );
    }

    getSchoolList(parentId: string) {
        const payload = locationPayload.getSchoolList(parentId);

        return this.apiService.post(urlConfig.location.schoolUrl, payload).pipe(
            map((res: any) => {
                const result = res?.result?.response?.content || res?.result?.response || [];
                return result.map((item: any) => ({
                    ...item,
                    label: item.orgName || item.name,
                    value: item.id
                }));
            })
        );
    }

    getParentId(userLocations: any[], type: string): string {
        const location = userLocations.find((loc: any) => loc.type === type);
        return location?.id || '';
    }

    updateProfile(data: any) {
        return this.apiService.patch(urlConfig.profileListing.updateProfileUrl, data);
    }
}



