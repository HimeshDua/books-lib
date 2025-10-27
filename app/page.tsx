'use client';
import {Button} from '@/components/ui/button';
import React from 'react';

function Home() {
  return (
    <div>
      Home
      <div className="container">
        <Button
          onClick={async () => {
            const res = await fetch('/api/import', {method: 'POST'});
            const data = await res.json();
            console.log(data);
          }}
        >
          Fetch Books
        </Button>
      </div>
    </div>
  );
}

export default Home;
