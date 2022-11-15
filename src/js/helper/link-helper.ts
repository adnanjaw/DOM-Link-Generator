import {Link} from "../model/Link";
import $ from "jquery";

export class LinkHelper {

    static readonly LINK_BACKSLASH: string = '/';

    static isEmpty(obj: Record<string, any>): boolean {
        return Object.keys(obj).length === 0;
    }

    static validateUrl(url: string) {
        if (!url.endsWith(this.LINK_BACKSLASH)) {
            url = url + this.LINK_BACKSLASH
        }

        return url;
    }

    static createLinkTag(link: Link, value: string = '') {
        const href = this.validateUrl(link.url) + value;
        let h3 = `<h3>${link.name}</h3>`
        if (value.length > 0) {
            h3 = `<h3>${link.name} (${value})</h3>`
        }
        return $('<a></a>')
            .attr('href', href)
            .attr('target', '_blank')
            .attr('rel', 'noopener noreferrer')
            .append(h3);
    }
}