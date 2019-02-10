import {environment} from '../../environments/environment';

export function is_table_in_mobile_view(): boolean {
    const min_width = environment.min_desktop_width;
    return min_width >= window.innerWidth;
}
