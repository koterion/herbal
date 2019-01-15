<?php

namespace App\Models;

class MenuItem extends \TCG\Voyager\Models\MenuItem
{
    protected $translatable = [
        'title',
        'url',
    ];

    /**
     * Scope for getting menu items for current menu
     * @param $query
     * @param $name
     * @return mixed
     */
    public function scopeForMenu($query, $name){
        return $query
            ->whereHas('menu', function ($menu) use ($name){
                $menu->where('name', $name);
            })
            ->whereNull('parent_id')
            ->with(['children' => function($children){
                $children->orderBy('order')
                    ->with('translations');
            }])
            ->with('translations')
            ->orderBy('order');
    }

    public function parent()
    {
        return $this->hasOne(self::class, 'id', 'parent_id')
            ->with('children', 'parent');
    }
}
