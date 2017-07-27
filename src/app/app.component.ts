import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterModule, Routes, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	private versions: string[];
	private currentVersion: string;

		constructor(private translate: TranslateService, private router: Router) {
		//添加语言支持
		translate.addLangs(['zh-CN', 'en']);

		//默认语言
		translate.setDefaultLang('en');

		//translate.use('zh-CN');
		//获取当前浏览器环境的语言比如en、 zh
		let broswerLang = translate.getBrowserLang();
		translate.use(broswerLang.match(/en|zh-CN/) ? broswerLang : 'zh-CN');

		this.versions = ['V2013', 'V2014', 'V2017'];
		this.currentVersion = this.versions[0];
	}

	changeLang(lang) {
    console.log(lang);
    this.translate.use(lang);
  }

  changeVersion(version) {
  	this.router.navigate([version]);
  }
}
