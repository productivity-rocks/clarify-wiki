// classes
import { Component, ElementRef, Renderer2 } from '@angular/core';
// services
import { ArticleService } from '../services/article.service';
// model
import { Article } from '../model/article.model';
// modules
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'start-page',
    templateUrl: './startPage.component.html',
    styleUrls: ['./startPage.component.sass'],
    standalone: true,
    imports: [RouterModule, FormsModule, CommonModule]
})

export class StartPageComponent {
    articles: Article[] | undefined;
    filteredArticles: Article[] | undefined;
    searchTerm: string = '';

    maxResults: number = 5;

    initialMonthlyGoal: number = 40;
    monthlyIncrease: number = 20;

    constructor (
        private articleService: ArticleService,
        private renderer: Renderer2, private el: ElementRef
    ) { }

    ngOnInit(): void {
        this.articleService.getAllArticles().subscribe((data)=>{
            this.articles = data;
        })
    }

    search(): void {
        if (!this.articles || this.searchTerm.trim() === '') {
            this.filteredArticles = []; // Empty the filtered articles if the search term is empty
        } else {
            this.filteredArticles = this.articles
                .filter(article =>
                    article.title.toLowerCase().includes(this.searchTerm.toLowerCase())
                ).slice(0, this.maxResults); // Limit to the top results
        }
    
        this.updateArticleList();
    }
    
    updateArticleList(): void {
        const resultsContainer = this.el.nativeElement.querySelector('.results');
        this.renderer.setProperty(resultsContainer, 'innerHTML', '');
    
        this.filteredArticles?.forEach(article => {
            const a = this.renderer.createElement('a');
    
            // Create a span for each word in the title, highlighting the matching parts
            article.title.split(' ').forEach(word => {
                const span = this.renderer.createElement('span');
                const lowerCaseWord = word.toLowerCase();
                const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    
                if (lowerCaseWord.includes(lowerCaseSearchTerm)) {
                    // Find all occurrences of the search term in the word
                    const matches = [];
                    let index = lowerCaseWord.indexOf(lowerCaseSearchTerm);
                    while (index !== -1) {
                        matches.push({ start: index, end: index + lowerCaseSearchTerm.length });
                        index = lowerCaseWord.indexOf(lowerCaseSearchTerm, index + 1);
                    }
    
                    // Split the word into non-matching and matching parts
                    let lastIndex = 0;
                    matches.forEach(match => {
                        const beforeMatch = this.renderer.createText(word.slice(lastIndex, match.start));
                        const matchText = this.renderer.createElement('span');
                        this.renderer.addClass(matchText, 'highlight');
                        this.renderer.appendChild(matchText, this.renderer.createText(word.slice(match.start, match.end)));
                        this.renderer.appendChild(span, beforeMatch);
                        this.renderer.appendChild(span, matchText);
                        lastIndex = match.end;
                    });
    
                    // Add the remaining non-matching part
                    const remaining = this.renderer.createText(word.slice(lastIndex));
                    this.renderer.appendChild(span, remaining);
                    this.renderer.appendChild(a, span);
                } else {
                    this.renderer.appendChild(span, this.renderer.createText(word + ' '));
                    this.renderer.appendChild(a, span);
                }
            });
    
            this.renderer.setAttribute(a, 'href', '/' + article.path);
            this.renderer.appendChild(resultsContainer, a);
        });
    }
    
    calculateRemainingArticles(): { percent?: number, left?: number, error: boolean } {
        const currentDate = new Date();
        const startDate = new Date(2024, 0, 1);
    
        // months passed starting with 1
        const monthsPassed = ((currentDate.getFullYear() - startDate.getFullYear()) * 12 + currentDate.getMonth() - startDate.getMonth()) + 1;

        // calculate monthly goal + extra 20 per month
        const goal = monthsPassed * 40 + ((monthsPassed - 1) * monthsPassed / 2) * 20;

        // don't show bar if no articles
        if (!this.articles?.length) {
            return {error: true};
        } else {
            const percent = (this.articles.length / goal) * 100;
            if (percent > 100) {
                return {percent: 100, left: 0,  error: false};
            } else if (percent < 0) {
                return {error: true};
            } else {
                return {percent: percent, left: goal - this.articles.length, error: false};
            }
        }
    }
}
