// functions
import { Observable, map } from 'rxjs';
// classes
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// model
import { Article } from '../model/article.model';

@Injectable({
    providedIn: 'root',
})
export class ArticleService {
    private apiUrl = 'https://api.clarify.wiki/v1/article/';

    constructor(private http: HttpClient) {}

    // get specific article by path
    getArticle(path: String): Observable<Article> {
        return this.http.get<Article>(`${this.apiUrl}?path=${path}`);
    }
    
    // get all articles form database
    getAllArticles(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.apiUrl}`);
    }

    // search for articles by a given term
    searchArticles(term: string): Observable<Article[]> {
        return this.getAllArticles().pipe(
            // Filter articles based on the search term
            map((articles) => {
                const searchTermWords = term.toLowerCase().split(' ');

                return articles.filter(article =>
                    searchTermWords.every(word =>
                        article.title.toLowerCase().includes(word)
                    )
                );
            })
        );
    }
}
