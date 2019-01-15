<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\View;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public $language;

    public function __construct()
    {
        /**
         * Get current language
         */
        $this->language = LaravelLocalization::getCurrentLocale();

        /**
         * Get all localized variants of current url
         */
        $urls = [];
        foreach(LaravelLocalization::getSupportedLocales() as $locale => $array){
            $urls[$locale] = LaravelLocalization::getLocalizedURL(
                $locale,
                LaravelLocalization::getNonLocalizedURL(url()->current())
            );
        }

        /**
         * Share variables to view
         */
        View::share('menu_header', MenuItem::forMenu('header')->get());
        View::share('menu_footer', MenuItem::forMenu('footer')->get());
        View::share('language', $this->language);
        View::share('localizedUrls', $urls);
    }
}
