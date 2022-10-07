import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RecipesService } from "../recipes/recipes.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {

    constructor(private http: HttpClient, private recipesService: RecipesService, private authService: AuthService){}

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http.put('https://cookingapp-165cc-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes)
        .subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes(){
            return this.http
            .get<Recipe[]>(
                'https://cookingapp-165cc-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
            )
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
            tap(recipes => 
                {this.recipesService.setRecipes(recipes);
                }
            )   
            )
    }
}