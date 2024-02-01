import { Component, ChangeDetectionStrategy, OnInit, ViewEncapsulation,  InjectionToken, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Article } from '../model/article.model';
import { ArticleService } from '../services/article.service';
import { HeadService } from '../services/head.service';
import { Location } from '@angular/common';

import { CommonModule } from '@angular/common';
import { MarkdownModule, MarkdownComponent, provideMarkdown } from 'ngx-markdown';
import { MarkdownService } from 'ngx-markdown';

import { importProvidersFrom } from '@angular/core';

import { Title } from '@angular/platform-browser';


@Component({
    selector: 'article-component',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MarkdownModule, CommonModule,MarkdownComponent ],
    // providers: [provideMarkdown()],
    encapsulation: ViewEncapsulation.None,
    
})
export class ArticleComponent implements OnInit {
    currentPath: String | undefined;
    article: Article | false = false;

    constructor(
        private articleService: ArticleService,
        private route: ActivatedRoute,
        private titleService: HeadService,
        private location: Location,
        private title: Title
    ) { }

    ngOnInit(): void {
        this.currentPath = this.route.snapshot.url.map(segment => segment.path).join('/');
        // this.titleService.setTitle(`Clarify Wiki`);

        this.articleService.getArticle(this.currentPath).subscribe((data) => {
            if(data.content && data.title) {
                this.title.setTitle(`${data.title} - Clarify Wiki`);
                // this.titleService.setLanguage(`${data.language}`);
                // this.titleService.setDescription(data.description);
                // if(data.tags != null || data.tags != '') {
                //     this.titleService.setKeywords(data.tags);
                // }
                // this.titleService.setCanonicalUrl('https://clarify.wiki' + this.location.path());
                // this.article = {_id: "1", title: "1", description: "1", content: "# Title2", tags: "1", path: "1", created_at: "1", author_name: "1", author_id: "1", language: "1"};
                this.article = data;
                // this.article = {_id: "1", title: "1", description: "1", content: "# Title3", tags: "1", path: "1", created_at: "1", author_name: "1", author_id: "1", language: "1"};
            } else {
                // this.article = false;
                this.titleService.setTitle("Article Not Found - Clarify Wiki");
            }
        });
    }

    calculateReadTimeByCharacters(content: string, charactersPerMinute: number = 1000): string {
        const characters = content.length;
        const minutes = Math.ceil(characters / charactersPerMinute);

        if (minutes === 1) {
            return '1 minute';
        } else {
            return `${minutes} minutes`;
        }
    }
}
