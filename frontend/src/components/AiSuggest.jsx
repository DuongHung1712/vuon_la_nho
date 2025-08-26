import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const AiSuggest = () => {

    const [spaceDesc, setSpaceDesc] = useState("");
    const [preferences, setPreferences] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleSuggest = async () => {
        const res = await fetch("/api/suggest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spaceDesc, preferences })
        });
        const data = await res.json();
        setSuggestions(data);
    };

    return (
        <div id='#aisuggest' className='max-w-4xl mx-auto'>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-sparkles inline h-8 w-8 text-yellow-500 mr-2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
                    AI Gợi ý cây phù hợp
                </h2>
                <p className='text-gray-600'>Mô tả không gian và nhu cầu của bạn để nhận gợi ý cây cảnh phù hợp nhất</p>
            </div>
            <div>
                <div className='@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6'>
                    <div class="leading-none font-semibold">
                        Thông tin không gian của bạn
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Mô tả không gian</label>
                        <input data-slot="input" class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive" placeholder="VD: Phòng khách 20m², ánh sáng tự nhiên vừa phải..." />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Nhu cầu và sở thích</label>
                        <textarea data-slot="textarea" class="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" placeholder="VD: Muốn cây dễ chăm sóc, tạo không khí trong lành, màu xanh đậm..."></textarea>
                    </div>
                    <button data-slot="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-color-gray-600 text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[&gt;svg]:px-3 w-full" disabled="" >Nhận gợi ý AI</button>
                </div>
            </div>
        </div>
    )
}

export default AiSuggest
