import fs from 'fs';
import path from 'path';
import { Product, Order } from '@/types';
import { WebsiteCmsData } from '@/types/cms';
import { PRODUCTS } from '@/data/mockData';
import { INITIAL_ORDERS } from '@/data/mockOrders';
import { DEFAULT_CMS_DATA } from '@/data/defaultCmsData';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'customProducts.json');
const ORDERS_FILE = path.join(DATA_DIR, 'customOrders.json');
const CMS_FILE = path.join(DATA_DIR, 'customCms.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ---------------- PRODUCTS ---------------- //
export function getStoredProducts(): Product[] {
  ensureDataDir();
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      const customProducts: Product[] = JSON.parse(data);
      if (Array.isArray(customProducts) && customProducts.length > 0) {
        return customProducts;
      }
    }
  } catch (err) {
    console.error('Error reading customProducts.json:', err);
  }
  return PRODUCTS;
}

export function saveStoredProducts(products: Product[]): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing customProducts.json:', err);
    return false;
  }
}

// ---------------- ORDERS ---------------- //
export function getStoredOrders(): Order[] {
  ensureDataDir();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const customOrders: Order[] = JSON.parse(data);
      if (Array.isArray(customOrders) && customOrders.length > 0) {
        return customOrders;
      }
    }
  } catch (err) {
    console.error('Error reading customOrders.json:', err);
  }
  return INITIAL_ORDERS;
}

export function saveStoredOrders(orders: Order[]): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing customOrders.json:', err);
    return false;
  }
}

// ---------------- CMS DATA ---------------- //
export function getStoredCmsData(): WebsiteCmsData {
  ensureDataDir();
  try {
    if (fs.existsSync(CMS_FILE)) {
      const data = fs.readFileSync(CMS_FILE, 'utf-8');
      const customCms: WebsiteCmsData = JSON.parse(data);
      if (customCms && customCms.announcementBar) {
        return {
          ...DEFAULT_CMS_DATA,
          ...customCms,
        };
      }
    }
  } catch (err) {
    console.error('Error reading customCms.json:', err);
  }
  return DEFAULT_CMS_DATA;
}

export function saveStoredCmsData(cmsData: WebsiteCmsData): boolean {
  ensureDataDir();
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(cmsData, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing customCms.json:', err);
    return false;
  }
}
