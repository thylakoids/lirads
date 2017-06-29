import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
		constructor(private translate: TranslateService) {
		//添加语言支持
		translate.addLangs(['zh-CN', 'en']);

		//默认语言
		translate.setDefaultLang('en');

		//translate.use('zh-CN');
		//获取当前浏览器环境的语言比如en、 zh
		let broswerLang = translate.getBrowserLang();
		translate.use(broswerLang.match(/en|zh-CN/) ? broswerLang : 'zh-CN');
	}

	changeLang(lang) {
    console.log(lang);
    this.translate.use(lang);
  }
}
