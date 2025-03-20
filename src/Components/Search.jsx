import React from "react";

export default function Search({searchTerm,setSearchTerm}){
    return(
        <div className="search">
            <div>
                <img 
                    src='./public\search.svg' alt="search" 
                />
                <input
                    type="text" 
                    placeholder="Search through 300+ movies online" 
                    value={searchTerm}
                    onChange={(event)=>setSearchTerm(event.target.value)}
                />
            </div>
        </div>
        
    )
}