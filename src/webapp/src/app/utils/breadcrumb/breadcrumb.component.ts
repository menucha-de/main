import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreadCrumb } from './breadcrumb.interface';
import { filter, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { BroadcasterService } from 'src/app/services/broadcaster.service';
import { merge} from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() rootLabel: string;
  label: string;
  breadcrumbs: BreadCrumb[];
  fromBroadcast$ = this.broadcaster.on<string>('title').pipe(map(title => {
    this.label = title;
    return this.buildBreadCrumb(this.activatedRoute.root);
  }));
  fromNavigation$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    distinctUntilChanged(),
    map(() => this.buildBreadCrumb(this.activatedRoute.root)),
    startWith(this.buildBreadCrumb(this.activatedRoute.root))
  );
  breadcrumbs$ = merge(this.fromBroadcast$, this.fromNavigation$);
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private broadcaster: BroadcasterService,
  ) {
    // this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: BreadCrumb[] = []): BreadCrumb[] {
    // If no routeConfig is avalailable we are on the root path
    let label = '';
    let isClickable = false;
    let path = '';
    const routeConfig = route.routeConfig;
    if (routeConfig) {
      label = route.routeConfig.data?.breadcrumb;
      if (label == null) {
        label = '';
      }
      isClickable = routeConfig.data?.isClickable;
      path = route.routeConfig.path;
    }
    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      label = this.label;
      if (label == null) {
        label = route.snapshot.params[paramName];
      }
    }
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: BreadCrumb = {
      label: label,
      url: nextUrl,
      isActive: isClickable
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    this.label = null;
    return newBreadcrumbs;
  }
}
