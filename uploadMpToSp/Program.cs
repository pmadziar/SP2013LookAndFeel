using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Publishing;
using Microsoft.SharePoint.WebControls;

namespace uploadMpToSp
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args?.Length != 2)
            {
                throw new ArgumentException(
                    $"Usage: {typeof (Program).Namespace}.exe c:\\somewhere\\MasterPageFullPath.master http://sharepoiont/site/url");
            }

            //if (!File.Exists(args[0]))
            //{
            //    throw new FileNotFoundException("Master Page not found", args[0]);
            //}

            List<string> fileNames = new List<string>();

            try
            {
                var dirPath = Path.GetDirectoryName(args[0]);
                if (!Directory.Exists(dirPath))
                {
                    throw new DirectoryNotFoundException(dirPath);
                }

                var filter = Path.GetFileName(args[0]);
                var filesInDir = Directory.GetFiles(dirPath, filter);
                if (filesInDir?.Length == 0)
                {
                    throw new FileNotFoundException($"Master Page not found: {args[0]}");
                }
                fileNames.AddRange(filesInDir);
            }
            catch (Exception)
            {
                throw;
            }

            if (fileNames?.Count > 0)
            {
                try
                {
                    string siteUrl = args[1];
                    using (SPSite s = new SPSite(siteUrl))
                    {
                        using (SPWeb w = s.OpenWeb(s.RootWeb.ID))
                        {
                            SPList mpCatalog = w.GetCatalog(SPListTemplateType.MasterPageCatalog);

                            SPFolder fld = mpCatalog.RootFolder;

                            Uri uri = new Uri(siteUrl);
                            if (uri.AbsolutePath != w.ServerRelativeUrl)
                            {
                                fld = w.GetFolder(uri.AbsolutePath);
                            }

                            if (fld.Exists)
                            {
                                foreach (var fileName in fileNames)
                                {
                                    string fname = Path.GetFileName(fileName);

                                    byte[] allBytes = File.ReadAllBytes(fileName);
                                    var spPath = $"{fld.ServerRelativeUrl}/{fname}";
                                    Console.WriteLine($"Uploading {fname} into {spPath}");
                                    SPFile spFile = w.GetFile(spPath);
                                    if (!spFile.Exists)
                                    {
                                        throw new SPException("Upload file manually first time");
                                    }
                                    spFile.CheckOut();
                                    spFile.SaveBinary(allBytes);
                                    spFile.CheckIn("Automatically updated", SPCheckinType.MajorCheckIn);
                                    spFile.Publish("Automatically published");
                                }
                            }
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }
    }
}