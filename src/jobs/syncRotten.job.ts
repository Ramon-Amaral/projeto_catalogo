import cron from 'node-cron';
import axios from 'axios';
import pool from '../config/database.js';

interface OmdbRating{
  Source: string
  Value: string
}

interface OmdbResponse{
  Respose: 'True' | 'False';
  Ratings?: OmdbRating [];
  Error?: string;
}