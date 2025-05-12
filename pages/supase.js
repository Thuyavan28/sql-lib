// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
// src/utils/borrowBook.js
import { supabase } from '../supabase';  // Import the Supabase client

// This function will be responsible for borrowing a book
export const borrowBook = async (userId, title, author) => {
  // Step 1: Get the book's ID using the title and author
  const { data: book, error: bookError } = await supabase
    .from('book_details')
    .select('id')
    .eq('title', title)
    .eq('author', author)
    .single(); // We expect only one match (hence, `.single()`)

  if (bookError || !book) {
    console.error('Book not found');
    return { error: 'Book not found' };
  }

  // Step 2: Insert the borrow record into `user_book_link` table
  const { error: insertError } = await supabase
    .from('user_book_link')
    .insert([
      {
        user_id: userId,   // The user who is borrowing the book
        book_id: book.id,  // The ID of the book
      }
    ]);

  // Handle potential insert error
  if (insertError) {
    console.error('Error borrowing book', insertError);
    return { error: 'Error borrowing book' };
  } else {
    console.log('Book borrowed successfully');
    return { success: 'Book borrowed successfully' };
  }
};
