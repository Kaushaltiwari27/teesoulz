import { NextRequest, NextResponse } from 'next/server';
import { getStoredCmsData, saveStoredCmsData } from '@/lib/storeData';
import { WebsiteCmsData } from '@/types/cms';

export async function GET() {
  try {
    const cms = getStoredCmsData();
    return NextResponse.json({ success: true, cms });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Partial<WebsiteCmsData> = await req.json();
    const existing = getStoredCmsData();

    const merged: WebsiteCmsData = {
      ...existing,
      ...body,
      announcementBar: {
        ...existing.announcementBar,
        ...(body.announcementBar || {}),
      },
      curatedSections: {
        ...existing.curatedSections,
        ...(body.curatedSections || {}),
      },
      campaignBanners: {
        ...existing.campaignBanners,
        ...(body.campaignBanners || {}),
      },
      editorialCulture: {
        ...existing.editorialCulture,
        ...(body.editorialCulture || {}),
      },
      customerReviews: {
        ...existing.customerReviews,
        ...(body.customerReviews || {}),
      },
      trustPerks: {
        ...existing.trustPerks,
        ...(body.trustPerks || {}),
      },
      updatedAt: new Date().toISOString(),
    };

    saveStoredCmsData(merged);

    return NextResponse.json({ success: true, cms: merged });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
