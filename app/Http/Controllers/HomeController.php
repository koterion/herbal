<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function index(Request $request): View
    {
        return view('home.index', [
            'request'    => $request,
            'socketRoom' => 'home',
        ]);
    }
}
